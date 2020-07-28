export const loginPassword = (phone: string, password: string) => {
  return function (dispatch) {
    console.log(222);
    // request("/api/auth/login/password", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     username: phone,
    //     password,
    //   }),
    // }).then((s) => {
    //   console.log(s);
    //   if (s.success) {
    //     dispatch({
    //       type: "login",
    //       payload: {
    //         userId: s.data.userid,
    //         token: s.data.token,
    //         userName: s.data.user.nickname,
    //         phone: s.data.user.phone,
    //         openid: s.data.openid,
    //         avatar: s.data.user.photo,
    //       },
    //     });
    //     setStorage({
    //       userId: s.data.userid,
    //       token: s.data.token,
    //       userName: s.data.user.nickname,
    //       phone: s.data.user.phone,
    //       openid: s.data.openid,
    //       avatar: s.data.user.photo,
    //     });
    //     // history.push("/home");
    //   }
    // });
  };
};
