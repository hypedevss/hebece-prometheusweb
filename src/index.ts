import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import FunctionListStudents from "./functions/listStudents";
import FunctionLoginHandler from "./functions/loginHandler";
import FunctionSelectStudent from "./functions/selectStudent";
import { CookieJar } from "tough-cookie";
import { LoginSuccessObject, PrometheusStudent, SelectedStudent } from "d:/Nodev2/hebece-prometheusweb/src/functions/index";

const GlobalCookieJar = new CookieJar();
let html:string = null;
let selectedStudent:SelectedStudent = null;
let students:Array<PrometheusStudent> = null;

 class LoginHandler {
		captcha: any[];
		captchaQuestion: any;
		isCaptchaRequired: boolean;
		login: (captcha?: string) => Promise<LoginSuccessObject>;
		initializeLogin: () => Promise<boolean>;
		/**
		 * The login handler, allows authentication with VULCAN servers.
		 * @param login Your login that you use on eduvulcan.pl
		 * @param password Your password that you use on eduvulcan.pl
		 */
		constructor(login: string, password: string) {
			let captcha1 = null;
			let captcha2 = null;
			let captchaQuestion = null;
			let isCaptchaRequired = false;
			this.captcha = [
				captcha1,
				captcha2
			]
			this.captchaQuestion = captchaQuestion;
			this.isCaptchaRequired = isCaptchaRequired;
			const logHandler = new FunctionLoginHandler(login, password, GlobalCookieJar);
			/**
			 * Logs the user in if the credentials are correct
			 * @param {string} captcha - The captcha code (if required)
			 */
			this.login = async (captcha?: string) => {
				const loginReq = await logHandler.login(captcha);
				html = loginReq.html;
				return loginReq;
			}
			/**
			 * Initializes the Login Handler
			 * @async
			 */
			this.initializeLogin = async () => logHandler.initializeLogin();
			this.captcha = logHandler.captcha;
			this.captchaQuestion = logHandler.captchaQuestion;
			this.isCaptchaRequired = logHandler.isCaptchaRequired;
		}
}
/**
 * Gets the list of assigned students to your account
 * @async
 * @returns {List} The list of students
 */
async function ListStudents() {
	const list = await FunctionListStudents(GlobalCookieJar, html);
	students = list;
	return list as Array<PrometheusStudent>;
}
/**
 * Selects a student that will be used to communicate with the API
 * @param index The index of the students list array you want to use
 * @returns {SelectedStudent} The selected student's data
 */
async function SelectStudent(index: number) {
	const select = await FunctionSelectStudent(GlobalCookieJar, students, index);
	selectedStudent = select;
	return select as SelectedStudent;
}

export { LoginHandler, ListStudents, SelectStudent };