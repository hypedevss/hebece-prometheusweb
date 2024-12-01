import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import * as cheerio from "cheerio";
import { CookieJar } from "tough-cookie";
import { Context, PrometheusStudent, SelectedStudent, VParam } from ".";
import PrometheusError from "../utils/errors/PrometheusError";
export default async function selectStudent(jar: CookieJar, students: Array<PrometheusStudent>, which: number) {
	const client = wrapper(axios.create({ jar }));
	const student = students[which];
	const loginReq1 = await client.get(`https://eduvulcan.pl/${student.journalUrl}`);
	const $ = cheerio.load(loginReq1.data);
	const wa = $('input[name=wa]').val();
	const wresult = $('input[name=wresult]').val();
	const wctx = $('input[name=wctx]').val();
	const formUrl = $('form[name=hiddenform]').attr('action');
	const postForm = await client.post(formUrl, new URLSearchParams({
		'wa': wa.toString(),
		'wresult': wresult.toString(),
		'wctx': wctx.toString()
	}), {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	})
	const $$ = cheerio.load(postForm.data);
	const wa2 = $$('input[name=wa]').val();
	const wresult2 = $$('input[name=wresult]').val();
	const wctx2 = $$('input[name=wctx]').val();
	const formUrl2 = $$('form[name=hiddenform]').attr('action');
	const postForm2 = await client.post(formUrl2, new URLSearchParams({
		'wa': wa2.toString(),
		'wresult': wresult2.toString(),
		'wctx': wctx2.toString()
	}), {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	})
	const $$2 = cheerio.load(postForm2.data);
	if ($$2('title').text() !== "Uczeń") throw new PrometheusError('Unknown error.');
	const vparamHtml = $$2('script').first().html();
	const regex = /var VParam = ({.*?});/s;
	const match = vparamHtml.match(regex);
	let vparam:VParam = null;
	if (match && match[1]) {
		// INFO
		// If you know, replace this with a better method.
		let jsonString = match[1].replace(/(\w+)\s*:/g, '"$1":');
		jsonString = jsonString.replace(/"true"/g, 'true');
		jsonString = jsonString.replace(/"serverDate":\s*[^,}]+,?\s*/g, '');
		jsonString = jsonString.replace(/"footerLogo":\s*[^,}]+,?\s*/g, '');
		jsonString = jsonString.replace(/"false"/g, 'false');
		jsonString = jsonString.replace(/"(\d+(\.\d+)?)"/g, '$1');
		jsonString = jsonString.replaceAll('""', "")
		jsonString = jsonString.replaceAll("https\"", "\"https")
		jsonString = jsonString.replaceAll("'\"\"", "\"")
		jsonString = jsonString.replaceAll("'", "\"")
		vparam = JSON.parse(jsonString)
	}
	const apiurl = vparam.apiUrl;
	const context = await client.get(`${apiurl}/Context`, {
		headers: {
			"Content-Type": "application/json"
		}
	});
	const contextData:Context = context.data;
	const outObj:SelectedStudent = {
		context: contextData,
		apiUrl: apiurl,
		messagesUrl: vparam.wiadomosciUrl,
		name: contextData.uczniowie[0].uczen,
		key: contextData.uczniowie[0].key,
		messageBoxId: contextData.uczniowie[0].globalKeySkrzynka,
	}
	return outObj as SelectedStudent;
	
};