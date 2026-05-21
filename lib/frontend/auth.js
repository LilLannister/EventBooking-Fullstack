export function saveAuthData(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  window.dispatchEvent(new Event("authChange"));
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  return JSON.parse(user);
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("authChange"));
}