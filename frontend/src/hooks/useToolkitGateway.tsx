import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export type UserData = {
  display_name: string;
  email: string;
  photo_url: string;
  uid: string;
};

const AUTH_FRONTEND_URL =
  "https://apacaiprototyping-jhe7v3aovq-uc.a.run.app";
const AUTH_BACKEND_URL =
  "https://toolkit-gateway-backend-jhe7v3aovq-uc.a.run.app";
const TGW_SESSION_ID_COOKIE_KEY = "x-tgw-session-id";
const TGW_NONCE_COOKIE_KEY = "x-tgw-nonce";

const useTookitGateway = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const search = window.location.search;

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    const params = new URLSearchParams(search);
    const sessionId = params.get("sessionId");

    if (sessionId != null) {
      Cookies.set(TGW_SESSION_ID_COOKIE_KEY, sessionId);
      window.location.href = "/";
    }

    return getUserDataFromSessionIdIfExists();
  };

  const genNonceAndRedirect = () => {
    const nonce = uuidv4();
    Cookies.set(TGW_NONCE_COOKIE_KEY, nonce);
    window.location.href = `${AUTH_FRONTEND_URL}/signin?origin=${window.location.href}&nonce=${nonce}`;
  };

  const verifySession = async ({
    nonce,
    sessionId,
  }: {
    nonce: string;
    sessionId: string;
  }) => {
    const url = `${AUTH_BACKEND_URL}/v1/session/verify`;
    const res = await axios.post(url, {
      nonce,
      session_id: sessionId,
    });
    const data = res.data;
    return data;
  };

  const getUserDataFromSessionIdIfExists = async () => {
    const sessionId = Cookies.get(TGW_SESSION_ID_COOKIE_KEY);
    const existingNonce = Cookies.get(TGW_NONCE_COOKIE_KEY);

    if (sessionId == null || existingNonce == null) {
      return genNonceAndRedirect();
    }

    try {
      const userData = await verifySession({
        nonce: existingNonce,
        sessionId,
      });
      setUser(userData);
    } catch (e) {
      return genNonceAndRedirect();
    }
  };

  const signOut = () => {
    Cookies.remove(TGW_SESSION_ID_COOKIE_KEY);
    window.location.href = `${AUTH_FRONTEND_URL}/signout`;
  };

  return {
    user,
    signOut,
  };
};

export default useTookitGateway;
