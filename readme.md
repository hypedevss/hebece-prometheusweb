<img align="center" src="/assets/prometheus-addon.png">
<div align="center">
<p>
<a href="https://www.npmjs.com/package/@hebece/addon-prometheusweb"><img src="https://img.shields.io/npm/v/@hebece/addon-prometheusweb.svg"></a>
<a href="https://www.npmjs.com/package/@hebece/addon-prometheusweb"><img src="https://img.shields.io/npm/dm/@hebece/addon-prometheusweb.svg"></a>
</div>

# Features
- [x] Authentication
- [x] Multi student
- [x] Messages (Reading)
- [x] Messages (Sending)



# Notice
This library is **highly** experimental, unexcepted errors may occur.

If you find an error, try to fix it yourself, or make an issue.

**REMEMBER** Sometimes i can't replicate the issue on my account, so i would need your help in that case.

# Usage

Example code:

```js
import { ListStudents, LoginHandler, SelectStudent } from '@hebece/addon-prometheusweb'
const user = 'your login'
const pass = 'your password';
(async () => {
	const loginhandler = new LoginHandler(user, pass);
	await loginhandler.initializeLogin();
	const captchaImg1 = loginhandler.captcha[0]; // base 64 encoded
	const captchaImg2 = loginhandler.captcha[1]; // base 64 encoded
	await loginhandler.login();
	const students = await ListStudents();
	console.log(students)
	const selectedStudent = await SelectStudent(0);
	console.log(selectedStudent);
})()
```

### Proper documentation soon