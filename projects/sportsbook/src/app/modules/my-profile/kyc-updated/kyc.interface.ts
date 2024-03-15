export interface Kyc {
	code: string;
	job_complete: boolean;
	job_success: boolean;
	signature: string;
	timestamp: string;
	result: Result;
	history: History[];
	image_links: ImageLinks;
}

export interface Result {
	DOB: string;
	Photo: string;
	Gender: string;
	IDType: string;
	Source: string;
	Actions: Actions;
	Address: string;
	Country: string;
	Document: string;
	FullData: FullData;
	FullName: string;
	IDNumber: string;
	ResultCode: string;
	ResultText: string;
	ResultType: string;
	SmileJobID: string;
	PhoneNumber: string;
	IssuanceDate: string;
	PhoneNumber2: string;
	IsFinalResult: string;
	PartnerParams: PartnerParams;
	ExpirationDate: string;
	Secondary_ID_Number: string;
}

export interface Actions {
	Verify_ID_Number: string;
	Return_Personal_Info: string;
}

export interface FullData {
	nin: string;
	slip: string;
	vNIN: string;
	email: string;
	photo: string;
	place: string;
	state: string;
	title: string;
	gender: string;
	height: string;
	userid: string;
	message: string;
	nok_lga: string;
	success: boolean;
	surname: string;
	nok_town: string;
	psurname: string;
	birthdate: string;
	centralID: string;
	firstname: string;
	nok_state: string;
	othername: string;
	birthstate: string;
	documentno: string;
	maidenname: string;
	middlename: string;
	pfirstname: string;
	profession: string;
	trackingId: string;
	nationality: string;
	nspokenlang: string;
	ospokenlang: string;
	pmiddlename: string;
	telephoneno: string;
	birthcountry: string;
	nok_address1: string;
	nok_address2: string;
	nok_lastname: string;
	maritalstatus: string;
	nok_firstname: string;
	residence_lga: string;
	nok_middlename: string;
	nok_postalcode: string;
	residence_town: string;
	residence_state: string;
	residencestatus: string;
	self_origin_lga: string;
	educationallevel: string;
	employmentstatus: string;
	self_origin_place: string;
	self_origin_state: string;
	residence_AddressLine1: string;
	residence_AddressLine2: string;
}

export interface PartnerParams {
	job_id: string;
	user_id: string;
	job_type: number;
}

export interface History {
	DOB: string;
	Photo: string;
	Gender: string;
	IDType: string;
	Source: string;
	Actions: Actions2;
	Address: string;
	Country: string;
	Document: string;
	FullData: FullData2;
	FullName: string;
	IDNumber: string;
	ResultCode: string;
	ResultText: string;
	ResultType: string;
	SmileJobID: string;
	PhoneNumber: string;
	IssuanceDate: string;
	PhoneNumber2: string;
	IsFinalResult: string;
	PartnerParams: PartnerParams2;
	ExpirationDate: string;
	Secondary_ID_Number: string;
}

export interface Actions2 {
	Verify_ID_Number: string;
	Return_Personal_Info: string;
}

export interface FullData2 {
	nin: string;
	slip: string;
	vNIN: string;
	email: string;
	photo: string;
	place: string;
	state: string;
	title: string;
	gender: string;
	height: string;
	userid: string;
	message: string;
	nok_lga: string;
	success: boolean;
	surname: string;
	nok_town: string;
	psurname: string;
	birthdate: string;
	centralID: string;
	firstname: string;
	nok_state: string;
	othername: string;
	birthstate: string;
	documentno: string;
	maidenname: string;
	middlename: string;
	pfirstname: string;
	profession: string;
	trackingId: string;
	nationality: string;
	nspokenlang: string;
	ospokenlang: string;
	pmiddlename: string;
	telephoneno: string;
	birthcountry: string;
	nok_address1: string;
	nok_address2: string;
	nok_lastname: string;
	maritalstatus: string;
	nok_firstname: string;
	residence_lga: string;
	nok_middlename: string;
	nok_postalcode: string;
	residence_town: string;
	residence_state: string;
	residencestatus: string;
	self_origin_lga: string;
	educationallevel: string;
	employmentstatus: string;
	self_origin_place: string;
	self_origin_state: string;
	residence_AddressLine1: string;
	residence_AddressLine2: string;
}

export interface PartnerParams2 {
	job_id: string;
	user_id: string;
	job_type: number;
}

export interface ImageLinks {
	id_photo_image: string;
	error?: string;
	id_card_image?: string;
	selfie_image?: string;
}
