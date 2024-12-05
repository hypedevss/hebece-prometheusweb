export interface LoginSuccessObject {
	success: boolean
	html: string
}

export interface ApiApContent {
	Success: boolean,
	Tokens: Array<string>,
	Alias: string,
	Email: string,
	EmailCandidate: null,
	GivenName: string,
	Surname: string,
	IsConsentAccepted: boolean,
	CanAcceptConsent: boolean,
	AccessToken: string,
	ErrorMessage: null,
	Capabilities: Array<string>,
}

export interface ApJwt {
	name: string
	uid: string
	tenant: string
	unituid: string
	uri: string
	service: string
	caps: string
	nbf: number
	exp: number
	iat: number
}

export interface PrometheusStudent {
	name: string
	journalUrl: string
	symbol: string
}

interface VParamUser {
	name: string
}
export interface VParam {
	appName: string,
	moduleName: string
	antiForgeryToken: string
	appGuid: string
	appUrl: string
	appCustomerDb: string
	apiUrl: string
	wiadomosciUrl: string
	wiadomosciNazwa: string
	logoutUrl: string
	prometeuszUrl: string
	user: VParamUser
	appVersion: string
	downloaderUrl: string
	downloaderBuffer: string
	downloaderInterval: string
	helpUrl: string
	manualUrl: string
	lastUpdatesUrl: string
	isStudent: boolean
	isParent: boolean
}

interface ContextData {
	idDziennik: number
	rodzajDziennika: number
	dziennikDataOd: string
	dziennikDataDo: string
	isUczen: boolean
	isPrzedszkolak: boolean
	isWychowanek: boolean
	key: string
	uczen: string
	oddzial: string
	jednostka: string
	jednostkaGodzinaOd: null | string
	jednostkaGodzinaDo: null | string
	isDorosli: boolean
	isPolicealna: boolean
	is13: boolean
	isArtystyczna: boolean
	isArtystyczna13: boolean
	isSpecjalna: boolean
	pelnoletniUczen: boolean
	opiekunUcznia: boolean
	wymagaAutoryzacji: boolean
	posiadaPesel: boolean
	aktywny: boolean
	globalKeySkrzynka: string
	config: ContextConfig
}

interface ContextConfig {
	isOplaty: boolean
	isPlatnosci: boolean
	isZaplac: boolean
	isScalanieKont: boolean
	isJadlospis: boolean
	isOffice365: boolean
	isSynchronizacjaEsb: boolean
	isDydaktyka: boolean
	isNadzorPedagogiczny: boolean
	isZmianaZajecia: boolean
	isZglaszanieNieobecnosci: boolean
	isLekcjeZrealizowane: boolean
	isLekcjeZaplanowane: boolean
	isPodreczniki: boolean
	oneDriveClientId: string
	projectClient: null
	payByNetUrlForPayment: string
}

export interface Context {
	uczniowie: Array<ContextData>
}

export interface SelectedStudent {
	context: Context
	apiUrl: string
	messagesUrl: string
	name: string
	key: string
	messageBoxId: string
}

export interface MessageBoxes {
	globalKey: string
	nazwa: string
	typUzytkownika: number
}

// messages

export interface MessageRaw {
	apiGlobalKey: string
	korespondenci: string
	temat: string
	data: string
	skrzynka: string
	hasZalaczniki: boolean
	przeczytana: boolean
	nieprzeczytanePrzeczytanePrzez: null | any
	wazna: boolean
	uzytkownikRola: number
	wycofana: boolean
	odpowiedziana: boolean
	przekazana: boolean
	id: number
}

export interface MessageEn {
	apiGlobalKey: string
	sender: string
	subject: string
	date: string
	box: string
	hasAttachments: boolean
	read: boolean
	readBy: null | any
	important: boolean
	userRole: number
	deleted: boolean
	replied: boolean
	forwarded: boolean
	id: number
}

interface MessageAttachmentRaw {
	url: string
	nazwaPliku: string
}

interface MessageAttachmentEn {
	url: string
	name: string
}

export interface MessageDetailsRaw {
	data: string
	apiGlobalKey: string
	nadawca: string
	nadawcaTyp: number
	odbiorcy: Array<string>
	tresc: string
	odczytana: boolean
	zalaczniki: Array<MessageAttachmentRaw>
	nadawcaInfo: string
	wycofana: boolean
	dataWycofania: null | string
	id: number
}

export interface MessageDetailsEn {
	data: string
	apiGlobalKey: string
	sender: string
	senderType: number
	recipients: Array<string>
	content: string
	read: boolean
	attachments: Array<MessageAttachmentEn>
	senderInfo: string
	deleted: boolean
	deletedDate: null | string
	id: number
}

// address book entry

export interface AddressBookEntryRaw {
	metadata: EmployeeMetadataRaw & StudentMetadataRaw & ParentMetadataRaw
	skrzynkaGlobalKey: string
	nazwa: string
	oddzial: null
	pseudonim: null
	hasInternetAccess: boolean
}

export interface AddressBookEntryEn {
	metadata: EmployeeMetadataEn & StudentMetadataEn & ParentMetadataEn
	boxGlobalKey: string
	name: string
	department: null
	nick: null
	hasInternetAccess: boolean
}

interface EmployeeMetadataRaw {
	role: Array<number>
	dziennikiZajeciaInneIds: Array<number>
	przedmiotyIds: Array<number>
	oddzialyIds: Array<number>
	oddzialyPrzedszkolneIds: Array<number>
	oddzialyWychowankowieIds: Array<number>
	oddzialyWychowawcyIds: Array<number>
	oddzialyPrzedszkolneWychowawcyIds: Array<number>
	oddzialyWychowankowieWychowawcyIds: Array<number>
}

interface EmployeeMetadataEn {
	roles: Array<number>
	otherLessonsIds: Array<number>
	subjectsIds: Array<number>
	departmentsIds: Array<number>
	preschoolDepartmentIds: Array<number>
	pupilDepartmentIds: Array<number>
	teacherDepartmentIds: Array<number>
	preschoolTeacherDepartmentIds: Array<number>
	pupilTeacherDepartmentIds: Array<number>
}

interface StudentMetadataRaw {
	isSamorzadSzkolny: boolean
	dziennikiZajeciaInneIds: Array<number> | null
	grupyIds: Array<number> | null
	oddzialyIds: Array<number> | null
	oddzialySamorzadUczniowskichIds: Array<number> | null
	oddzialyPrzedszkolneIds: Array<number> | null
	oddzialyWychowankowieIds: Array<number> | null
}

interface StudentMetadataEn {
	isSchoolSelfGovernment: boolean
	otherLessonsIds: Array<number> | null
	groupsIds: Array<number> | null
	departmentsIds: Array<number> | null
	studentSelfGovernmentDepartmentIds: Array<number> | null
	preschoolDepartmentIds: Array<number> | null
	pupilDepartmentIds: Array<number> | null
}

interface ParentMetadataRaw {
	dziennikiZajeciaInneIds: Array<number> | null
	oddzialyIds: Array<number> | null
	oddzialyRadaRodzicowIds: Array<number> | null
	oddzialyPrzedszkolneIds: Array<number> | null
	oddzialyPrzedszkolneRadaRodzicowIds: Array<number> | null
	oddzialyWychowankowieIds: Array<number> | null
}

interface ParentMetadataEn {
	otherLessonsIds: Array<number> | null
	departmentsIds: Array<number> | null
	parentCouncilDepartmentIds: Array<number> | null
	preschoolDepartmentIds: Array<number> | null
	preschoolParentCouncilDepartmentIds: Array<number> | null
	pupilDepartmentIds: Array<number> | null
}

// message sending

export interface MessageSendRaw {
	globalKey: string
	watekGlobalKey: string
	nadawcaSkrzynkaGlobalKey: string
	adresaciSkrzynkaGlobalKey: string
	tytul: string
	tresc: string
	zalaczniki: Array<MessageAttachmentRaw>
	powitalna: boolean
}

export interface MessageSendEn {
	globalKey: string
	threadGlobalKey: string
	senderBoxGlobalKey: string
	recipientsBoxGlobalKey: string
	title: string
	content: string
	attachments: Array<MessageAttachmentEn>
	isInitial: boolean
}