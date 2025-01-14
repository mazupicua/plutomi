import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { Dynamo } from "../../awsClients/ddbDocClient";
import Time from "../time";
import { nanoid } from "nanoid";
import { ENTITY_TYPES, ID_LENGTHS } from "../../Config";
import { DynamoNewApplicantResponse } from "../../types/dynamo";
import {
  CreateApplicantResponseInput,
  CreateApplicantResponseOutput,
} from "../../types/main";
const { DYNAMO_TABLE_NAME } = process.env;

/**
 * Creates an applicant response to a question
 * @param props {@link CreateApplicantResponseInput}
 * @returns {@link CreateApplicantResponseOutput}
 */
export async function createApplicantResponse(
  props: CreateApplicantResponseInput
): Promise<CreateApplicantResponseOutput> {
  const {
    orgId,
    applicantId,
    questionTitle,
    questionDescription,
    questionResponse,
  } = props;
  const responseId = nanoid(ID_LENGTHS.APPLICANT_RESPONSE);
  const newApplicantResponse: DynamoNewApplicantResponse = {
    PK: `${ENTITY_TYPES.ORG}#${orgId}#${ENTITY_TYPES.APPLICANT}#${applicantId}`,
    SK: `${ENTITY_TYPES.APPLICANT_RESPONSE}#${responseId}`,
    orgId: orgId,
    applicantId: applicantId,
    entityType: ENTITY_TYPES.APPLICANT_RESPONSE,
    createdAt: Time.currentISO(),
    responseId: responseId,
    questionTitle: questionTitle,
    questionDescription: questionDescription,
    questionResponse: questionResponse,
    GSI1PK: `${ENTITY_TYPES.ORG}#${orgId}#${ENTITY_TYPES.APPLICANT}#${applicantId}`,
    GSI1SK: ENTITY_TYPES.APPLICANT_RESPONSE, // TODO add timestmap?
  };

  const params: PutCommandInput = {
    TableName: DYNAMO_TABLE_NAME,
    Item: newApplicantResponse,
    ConditionExpression: "attribute_not_exists(PK)",
  };

  try {
    await Dynamo.send(new PutCommand(params));
    return newApplicantResponse;
  } catch (error) {
    // TODO error enum
    throw new Error(error);
  }
}
