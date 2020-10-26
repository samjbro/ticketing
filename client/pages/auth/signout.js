import { useEffect, useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/useRequest";

const SignOut = () => {
  const { sendRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    sendRequest();
  }, []);

  return <div>Signing you out...</div>;
};

export default SignOut;
