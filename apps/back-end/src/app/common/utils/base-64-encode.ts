import { AmrsSignInDto } from "../../auth/dto/amrs-auth.dto";

 export function base64Encode(signInDto: AmrsSignInDto) {
    const textToEncode = `${signInDto.username}:${signInDto.password}`;
    const encodedString = btoa(textToEncode);
    return encodedString;
  }