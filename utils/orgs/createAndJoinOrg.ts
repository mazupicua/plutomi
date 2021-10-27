import {
  TransactWriteCommand,
  TransactWriteCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { Dynamo } from "../../libs/ddbDocClient";
import { GetCurrentTime } from "../time";

const { DYNAMO_TABLE_NAME } = process.env;

export async function CreateAndJoinOrg({ user_id, org_id, GSI1SK }) {
  const now = GetCurrentTime("iso") as string;

  const new_org = {
    PK: `ORG#${org_id.toLowerCase()}`, // TODO add the org name filter here, or add it in middleware
    SK: `ORG`,
    org_id: org_id, // plutomi - Cannot be changed
    entity_type: "ORG",
    created_at: now,
    total_applicants: 0,
    total_openings: 0,
    total_stages: 0,
    total_users: 1,
    GSI1PK: `ORG`, // Allows for 'get all orgs' query
    // but cannot do get org by specific name as there might be duplicates
    GSI1SK: GSI1SK, // Actual org name ie: Plutomi Inc - Can be changed!
  };

  try {
    const transactParams: TransactWriteCommandInput = {
      TransactItems: [
        {
          // Update user with the new org
          Update: {
            Key: {
              PK: `USER#${user_id}`,
              SK: `USER`,
            },
            TableName: DYNAMO_TABLE_NAME,
            UpdateExpression:
              "SET org_id = :org_id, org_join_date = :org_join_date, GSI1PK = :GSI1PK",
            ExpressionAttributeValues: {
              ":org_id": org_id,
              ":org_join_date": now,
              ":GSI1PK": `ORG#${org_id}#USERS`,
            },
          },
        },
        {
          // Create the org
          Put: {
            Item: new_org,
            TableName: DYNAMO_TABLE_NAME,
            ConditionExpression: "attribute_not_exists(PK)",
          },
        },
      ],
    };

    const response = await Dynamo.send(
      new TransactWriteCommand(transactParams)
    );
    console.log("Create and join org response");
    console.log(response);
    return;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}