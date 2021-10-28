import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { Dynamo } from "../../libs/ddbDocClient";
import { GetCurrentTime } from "../time";
import { nanoid } from "nanoid";

const { DYNAMO_TABLE_NAME } = process.env;

export async function CreateApplicantResponse({
  org_id,
  applicant_id,
  question_title,
  question_description,
  question_response,
}: CreateApplicantResponseInput) {
  const now = GetCurrentTime("iso") as string;
  const response_id = nanoid(30);
  const new_applicant_response = {
    PK: `ORG#${org_id}#APPLICANT#${applicant_id}`,
    SK: `APPLICANT_RESPONSE#${response_id}`,
    org_id: org_id,
    applicant_id: applicant_id,
    entity_type: "APPLICANT_RESPONSE",
    created_at: now,
    response_id: response_id,
    question_title: question_title,
    question_description: question_description,
    question_response: question_response,
    GSI1PK: `ORG#${org_id}#APPLICANT#${applicant_id}`,
    GSI1SK: `APPLICANT_RESPONSE`, // TODO add timestmap?
  };

  const params: PutCommandInput = {
    TableName: DYNAMO_TABLE_NAME,
    Item: new_applicant_response,
    ConditionExpression: "attribute_not_exists(PK)",
  };

  try {
    await Dynamo.send(new PutCommand(params));

    return new_applicant_response;
  } catch (error) {
    throw new Error(error);
  }
}
