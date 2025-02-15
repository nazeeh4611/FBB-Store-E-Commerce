// // import { DecodedToken } from "../Interfacetypes/types";
// // import { useDispatch } from "react-redux";


// const ExtractToken = (token: string, name: "entrepreneur" | "investor" | "admin") => {
//   if (!token) {
//     console.error("Token not provided for the extraction");
//     return null;
//   }

//   try {
//     const tokenpart = token.split(".")[1];
//     if (!tokenpart) {
//       console.error("Invalid token format");
//       return null;
//     }

//     const decodedToken = JSON.parse(atob(tokenpart));

//     if (decodedToken.exp * 1000 < Date.now()) {
//       console.log("Token is expired");

//       // Dispatch the action to reset the token based on the name
//       if (name === "entrepreneur") {
//         dispatch(EntrepreneurAuth({ token: "", isVerifiedUser: false }));
//       } else if (name === "investor") {
//         dispatch(InvestorAuth({ token: "", isVerifiedUser: false }));
//       } else if (name === "admin") {
//         dispatch(AdminAuth({ token: "", isVerifiedUser: false }));
//       }

//       return null;
//     }

//     return decodedToken;
//   } catch (error) {
//     console.error("Error occurred while extracting the token");
//     return null;
//   }
// };

// export default ExtractToken;
