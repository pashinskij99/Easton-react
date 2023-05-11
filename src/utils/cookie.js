import Cookies from "js-cookie";

export function getAccessToken() {
  return Cookies.get("token");
}

export function setAccessToken(accessToken) {
  Cookies.set("token", accessToken);
}

export function removeAccessToken() {
  Cookies.remove("token");
}

export function setUserId(userId) {
  Cookies.set("userId", userId);
}

export function getUserId(userId) {
  return Cookies.get("userId");
}

export function removeUserId() {
  Cookies.remove("userId");
}
