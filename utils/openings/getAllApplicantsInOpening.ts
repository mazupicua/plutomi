import { QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { Dynamo } from "../../awsClients/ddbDocClient";
import { ENTITY_TYPES } from "../../Config";
import { DynamoNewApplicant } from "../../types/dynamo";
import { GetAllApplicantsInOpeningInput } from "../../types/main";
const { DYNAMO_TABLE_NAME } = process.env;

export async function getAllApplicantsInOpening(
  props: GetAllApplicantsInOpeningInput
): Promise<DynamoNewApplicant[]> {
  const { orgId, openingId } = props;
  const params: QueryCommandInput = {
    TableName: DYNAMO_TABLE_NAME,
    IndexName: "GSI1",
    KeyConditionExpression:
      "GSI1PK = :GSI1PK AND  begins_with(GSI1SK, :GSI1SK)",
    ExpressionAttributeValues: {
      ":GSI1PK": `${ENTITY_TYPES.ORG}#${orgId}#${ENTITY_TYPES.APPLICANT}S`,
      ":GSI1SK": `${ENTITY_TYPES.OPENING}#${openingId}`,
    },
  };

  try {
    // TODO - MAJOR!
    // Query until ALL items returned! Even though applicants are "split up" in a sense
    // That meaning, files, notes, etc are different items in Dynamo
    // The result might (and probably will!) be large enough that it might not be returned in one query
    const response = await Dynamo.send(new QueryCommand(params));
    const allApplicants = response.Items as DynamoNewApplicant[];

    const sortKey = "fullName";
    // Sort by full name, or whatever else, probably most recently active would be best
    allApplicants.sort((a, b) => (a[sortKey] < b[sortKey] ? 1 : -1));

    return allApplicants;
  } catch (error) {
    throw new Error(error);
  }
}
