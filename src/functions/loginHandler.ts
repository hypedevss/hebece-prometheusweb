import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import * as cheerio from "cheerio";
import PrometheusAuthError from "../utils/errors/PrometheusAuthError";
import { CookieJar } from "tough-cookie";
import { LoginSuccessObject } from ".";
class LoginHandler {
	initializeLogin: () => Promise<boolean>;
	captcha: String[];
	captchaQuestion: String;
	isCaptchaRequired: boolean;
	login: (captcha?: string) => Promise<LoginSuccessObject>;

	constructor(login: string, password: string, jar: CookieJar) {
		const client = wrapper(axios.create({ jar }));
		let captcha1 = null;
		let captcha2 = null;
		let captchaQuestion = null;
		let isCaptchaRequired = false;
		let csrf = null;
		this.captcha = [
			captcha1,
			captcha2
		]
		this.captchaQuestion = captchaQuestion;
		this.isCaptchaRequired = isCaptchaRequired;
		this.initializeLogin = async () => {
			const eduSite = await client.get("https://eduvulcan.pl/logowanie");
			const userInfo = await client.post("https://eduvulcan.pl/Account/QueryUserInfo", new URLSearchParams(
				{
					'alias': login
				}
			), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			})
			const $ = cheerio.load(eduSite.data);
			const token = $("input[name=__RequestVerificationToken]").val();
			const question = $('label[for=captchaUser]').text();
			const image1 =  $('img[class="v-captcha-image"]')[0].attribs.src;
			const image2 = $('img[class="v-captcha-image"]')[1].attribs.src;
			// save the data
			this.captchaQuestion = question;
			this.captcha[0] = image1;
			this.captcha[1] = image2;
			this.isCaptchaRequired = userInfo.data.data.ShowCaptcha;
			csrf = token;
			return true;
		}
		this.login = async (captcha?: string) => {
			if (!csrf) throw new PrometheusAuthError("Login function hasn't been initialized.")
			if (!captcha && this.isCaptchaRequired) throw new PrometheusAuthError("Captcha is required.")
			const loginReq = await client.post('https://eduvulcan.pl/logowanie', new URLSearchParams(
				{
					'Alias': login,
					'Password': password,
					'captchaUser': captcha || "",
					'__RequestVerificationToken': csrf
				}
			), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				maxRedirects: 1,
				validateStatus: () => true
			})
			if (loginReq.status === 200) {
				return {
					success: true,
					html: loginReq.data
				}

			}
			if (loginReq.status === 500) {
				const $ = cheerio.load(loginReq.data);
				const message = $('div[class="content-info-box2"]').text().replaceAll("            ", "").replaceAll("\r", "");
				throw new PrometheusAuthError(message);
			}
		}
		
	}
	
}



export default LoginHandler;