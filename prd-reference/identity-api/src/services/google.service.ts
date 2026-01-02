import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env";

const client = new OAuth2Client({
  clientId: env.google.clientId,
  clientSecret: env.google.clientSecret,
  redirectUri: env.google.redirectUri,
});

export const createGoogleAuthUrl = (state: string, codeVerifier: string) => {
  const codeChallenge = codeVerifier;
  const scope = [
    "openid",
    "profile",
    "email",
  ];
  const authUrl = client.generateAuthUrl({
    scope,
    state,
    codeChallenge,
    codeChallengeMethod: "plain",
    access_type: "offline",
    prompt: "consent",
  });
  return authUrl;
};

export const exchangeGoogleCode = async (
  code: string,
  codeVerifier: string
) => {
  const { tokens } = await client.getToken({
    code,
    codeVerifier,
  });
  return tokens;
};

export const verifyGoogleIdToken = async (idToken: string) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: env.google.clientId,
  });
  return ticket.getPayload();
};
