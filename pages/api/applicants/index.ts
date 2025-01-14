import { NextApiRequest, NextApiResponse } from "next";
import { getOpening } from "../../../utils/openings/getOpeningById";
import { createApplicant } from "../../../utils/applicants/createApplicant";
import { API_METHODS, DEFAULTS, EMAILS, ID_LENGTHS } from "../../../Config";
import withValidMethod from "../../../middleware/withValidMethod";
import {
  CreateApplicantAPIResponse,
  CreateApplicantAPIBody,
} from "../../../types/main";

import Joi from "joi";
import withCleanOrgId from "../../../middleware/withCleanOrgId";
import sendEmail from "../../../utils/sendEmail";
const UrlSafeString = require("url-safe-string"),
  tagGenerator = new UrlSafeString();

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<CreateApplicantAPIResponse>
): Promise<void> => {
  const { method, body } = req;
  const {
    orgId,
    openingId,
    firstName,
    lastName,
    email,
  }: CreateApplicantAPIBody = body;

  // Creates an applicant
  if (method === API_METHODS.POST) {
    const schema = Joi.object({
      orgId: Joi.string().invalid(
        DEFAULTS.NO_ORG,
        tagGenerator.generate(DEFAULTS.NO_ORG)
      ),
      email: Joi.string().email(),
      firstName: Joi.string().invalid(DEFAULTS.FIRST_NAME),
      lastName: Joi.string().invalid(DEFAULTS.FIRST_NAME),
      openingId: Joi.string(),
    }).options({ presence: "required" });

    // Validate input
    try {
      await schema.validateAsync(req.body);
    } catch (error) {
      return res.status(400).json({ message: `${error.message}` });
    }

    try {
      const opening = await getOpening({ orgId, openingId });

      // DO NOT REMOVE
      // We need the first stage in this opening
      if (!opening) {
        return res.status(404).json({ message: "Bad opening ID" });
      }

      try {
        const newApplicant = await createApplicant({
          orgId: orgId,
          firstName: firstName,
          lastName: lastName,
          email: email,
          openingId: openingId,
          stageId: opening.stageOrder[0],
        });

        const applicantionLink = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/${orgId}/applicants/${newApplicant.applicantId}`;

        await sendEmail({
          fromName: "Applications",
          fromAddress: EMAILS.GENERAL,
          toAddresses: [newApplicant.email], // TODO remove the quotes around this https://github.com/plutomi/plutomi/issues/342
          subject: `Here is a link to your application!`,
          html: `<h1><a href="${applicantionLink}" rel=noreferrer target="_blank" >Click this link to view your application!</a></h1><p>If you did not request this link, you can safely ignore it.</p>`,
        });

        return res.status(201).json({
          message: `We've sent a link to your email to complete your application!`,
        });
      } catch (error) {
        // TODO add error logger
        return res
          .status(400) // TODO change #
          .json({ message: `Unable to create applicant: ${error}` });
      }
    } catch (error) {
      return res.status(400).json({ message: `${error.message}` });
    }
  }
};

export default withCleanOrgId(withValidMethod(handler, [API_METHODS.POST]));
