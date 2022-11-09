export const handleAsync = (promise) =>
  promise
    .then((data) => Promise.resolve([data, undefined]))
    .catch((error) => Promise.resolve([undefined, error]))
