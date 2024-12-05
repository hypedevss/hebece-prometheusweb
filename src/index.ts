import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import FunctionListStudents from "./functions/listStudents";
import FunctionLoginHandler from "./functions/loginHandler";
import FunctionSelectStudent from "./functions/selectStudent";
import FunctionMessageManager from "./functions/messageManager";
import { CookieJar } from "tough-cookie";
import { AddressBookEntryEn, LoginSuccessObject, MessageDetailsEn, MessageEn, PrometheusStudent, SelectedStudent } from "d:/Nodev2/hebece-prometheusweb/src/functions/index";

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
/**
 * The message manager, allows you to get messages from the API
 */
class MessageManager {
	/**
	 * Initializes the message manager
	 * @async 
	 */
	initialize: () => Promise<boolean>;
	/**
	 * Gets messages from the API
	 * @async
	 * @param {Exclude<number, 0 | 1 | 2>} type The type of messages you want to get (0 = received 1 = sent 2 = deleted)
	 * @param {number} amount The amount of messages you want to get (Default 50)
	 * @param {number} lastMessageId The last message id you want to get (Default 0)
	 * @returns {Array<MessageEn>} The messages
	 */
	getMessages: (type: Exclude<number, 0 | 1 | 2>, amount?: number, lastMessageId?: number) => Promise<Array<MessageEn>>;
	/**
	 * Gets message details from the API
	 * @async
	 * @param {string} apiGlobalKey The API global key of the message you want to get details of
	 * @returns {MessageDetailsEn} The message details
	 */
	getMessageDetails: (apiGlobalKey: string) => Promise<MessageDetailsEn>;
	/**
	 * Gets the address book from the API
	 * @async
	 * @param {Exclude<number, 0 | 1 | 2>} type The type of address book you want to get (0 = employees 1 = students 2 = parents)
	 * @returns {Array<Array<AddressBookEntryEn>>} The address book
	 */
	getAddressBook: (type: Exclude<number, 0 | 1 | 2>) => Promise<Array<Array<AddressBookEntryEn>>>;
	/**
	 * Sends a message
	 * @async
	 * @param {Array<string>} receivers The global keys of the receivers
	 * @param {string} subject The subject of the message
	 * @param {string} content The content of the message
	 * @returns {any}
	 */
	send: (receivers: Array<string>, subject: string, content: string) => Promise<void>;
		constructor() {
			const msgmgr = new FunctionMessageManager(GlobalCookieJar, selectedStudent);
			this.initialize = async () => {
				return await msgmgr.initialize();
			}
			this.getMessages = async(type: Exclude<number, 0 | 1 |2>, amount?: number, lastMessageId?: number) => {
				return await msgmgr.getMessages(type, amount, lastMessageId);
			}
			this.getMessageDetails = async(apiGlobalKey: string) => {
				return await msgmgr.getMessageDetails(apiGlobalKey);
			}
			this.getAddressBook = async(type: Exclude<number, 0 | 1 |2>) => {
				return await msgmgr.getAddressBook(type);
			}
			this.send = async(receivers: Array<string>, subject: string, content: string) => {
				return await msgmgr.sendMessage(receivers, subject, content);
			}
		}
	}

export { LoginHandler, ListStudents, SelectStudent, MessageManager };