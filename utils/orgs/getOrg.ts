require("dotenv").config();
import { GetCommand, GetCommandInput } from "@aws-sdk/lib-dynamodb";
import { Dynamo } from "../../awsClients/ddbDocClient";
import { ENTITY_TYPES } from "../../Config";
import { DynamoNewOrg } from "../../types/dynamo";
import { GetOrgInput } from "../../types/main";

const { DYNAMO_TABLE_NAME } = process.env;
/**
 * @param orgId
 */
export async function getOrg(props: GetOrgInput) {
  const { orgId } = props;
  const params: GetCommandInput = {
    TableName: DYNAMO_TABLE_NAME,
    Key: {
      PK: `${ENTITY_TYPES.ORG}#${orgId}`,
      SK: ENTITY_TYPES.ORG,
    },
  };

  try {
    const response = await Dynamo.send(new GetCommand(params));
    return [response.Item as DynamoNewOrg, null];
  } catch (error) {
    console.error("error", error);
    return [null, error];
  }
}
