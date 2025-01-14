import { NextApiRequest, NextApiResponse } from "next";
import { getApplicantById } from "../../../../utils/applicants/getApplicantById";
import deleteApplicant from "../../../../utils/applicants/deleteApplicant";
import updateApplicant from "../../../../utils/applicants/updateApplicant";
import { withSessionRoute } from "../../../../middleware/withSession";
import withValidMethod from "../../../../middleware/withValidMethod";
import withAuth from "../../../../middleware/withAuth";
import { API_METHODS, DEFAULTS } from "../../../../Config";
import { CUSTOM_QUERY } from "../../../../types/main";
const UrlSafeString = require("url-safe-string"),
  tagGenerator = new UrlSafeString();


import Joi from "joi";
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { method, query, body } = req;
  const { applicantId } = query as Pick<CUSTOM_QUERY, "applicantId">;

  if (method === API_METHODS.GET) {
    try {
      // TODO gather applicant responses here
      const applicant = await getApplicantById({
        applicantId: applicantId,
        orgId: req.session.user.orgId,
      });

      if (!applicant) {
        return res.status(404).json({ message: "Applicant not found" });
      }
      return res.status(200).json(applicant);
    } catch (error) {
      // TODO add error logger
      return res
        .status(400) // TODO change #
        .json({ message: `Unable to get applicant: ${error}` });
    }
  }

  if (method === API_METHODS.PUT) {
    try {
      const updateApplicantInput = {
        orgId: req.session.user.orgId,
        applicantId: applicantId,
        newApplicantValues: body.newApplicantValues,
      };

      const schema = Joi.object({
        orgId: Joi.string().invalid(DEFAULTS.NO_ORG, tagGenerator.generate(DEFAULTS.NO_ORG)),
        applicantId: Joi.string(),
        newApplicantValues: Joi.object(), // todo add banned keys
      }).options({ presence: "required" });

      // Validate input
      try {
        await schema.validateAsync(updateApplicantInput);
      } catch (error) {
        return res.status(400).json({ message: `${error.message}` });
      }

      await updateApplicant(updateApplicantInput);
      return res.status(200).json({ message: "Applicant updated!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Unable to update applicant - ${error}` });
    }
  }

  if (method === API_METHODS.DELETE) {
    try {
      await deleteApplicant({
        orgId: req.session.user.orgId,
        applicantId: applicantId!,
      });
      return res.status(200).json({ message: "Applicant deleted!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Unable to delete applicant - ${error}` });
    }
  }
};

export default withValidMethod(withSessionRoute(withAuth(handler)), [
  API_METHODS.DELETE,
  API_METHODS.GET,
  API_METHODS.PUT,
]);
