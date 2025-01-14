import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import Time from "../time";
import { Dynamo } from "../../awsClients/ddbDocClient";
import { ENTITY_TYPES, TIME_UNITS } from "../../Config";
import { CreateLoginLinkInput } from "../../types/main";
import { DynamoNewLoginLink } from "../../types/dynamo";

const { DYNAMO_TABLE_NAME } = process.env;

/**
 * Creates a login link for the requested user
 * @param props {@link CreateLoginLinkInput}
 * @returns
 */
export default async function createLoginLink(
  props: CreateLoginLinkInput
): Promise<void> {
  const { userId, loginLinkId } = props;
  const now = Time.currentISO();
  try {
    const newLoginLink: DynamoNewLoginLink = {
      PK: `${ENTITY_TYPES.USER}#${userId}`,
      SK: `${ENTITY_TYPES.LOGIN_LINK}#${loginLinkId}`,
      entityType: ENTITY_TYPES.LOGIN_LINK,
      createdAt: now,
      ttlExpiry: Time.futureUNIX(1, TIME_UNITS.MINUTES), // Deleted after 15 minutes, must be >= ttl on `sealData`
      GSI1PK: `${ENTITY_TYPES.USER}#${userId}#${ENTITY_TYPES.LOGIN_LINK}S`, // Get latest login link(s) for a user for throttling
      GSI1SK: now,
    };

    const params: PutCommandInput = {
      TableName: DYNAMO_TABLE_NAME,
      Item: newLoginLink,
      ConditionExpression: "attribute_not_exists(PK)",
    };

    await Dynamo.send(new PutCommand(params));
    return;
  } catch (error) {
    console.error(error);
    throw new Error(`Unable to create login link ${error}`);
  }
}
