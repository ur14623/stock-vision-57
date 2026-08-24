import { API_BASE, authFetch, authHeaders, handleResponse } from "./base";

/* -------- Types -------- */

export interface SupportedLanguage {
  id: number;
  code: string;
  name: string;
  native_name?: string;
  is_active: boolean;
  created_at?: string;
}

export interface SupportedChannel {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
  priority: number;
  created_at?: string;
}

export interface DataSource {
  id: number;
  name: string;
  source_type: string;
  host: string;
  port: number;
  database_name: string;
  username: string;
  password?: string;
  is_active: boolean;
  created_at?: string;
}

export interface SenderIdConfig {
  id: number;
  sender_id: string;
  description: string;
  country_code: string;
  is_active: boolean;
  is_verified: boolean;
  channel: number;
  channel_name?: string;
  created_at?: string;
}

export interface EmailService {
  id: number;
  name: string;
  provider: string;
  host: string;
  port: number;
  username: string;
  password?: string;
  from_email: string;
  from_name?: string;
  use_tls: boolean;
  is_active: boolean;
  is_default?: boolean;
  created_at?: string;
}

export interface CustomerProfileConfig {
  id: number;
  name: string;
  data_source?: number | null;
  data_source_name?: string;
  table_name: string;
  phone_field: string;
  name_field?: string;
  email_field?: string;
  language_field?: string;
  filter_query?: string;
  is_active: boolean;
  created_at?: string;
}

/* -------- Generic CRUD helpers -------- */

async function crudList<T>(path: string) {
  const res = await authFetch(`${API_BASE}${path}`, { headers: authHeaders() });
  const data = await handleResponse<{ results?: T[] } | T[]>(res);
  const results = Array.isArray(data) ? data : data.results ?? [];
  return { results };
}

async function crudRetrieve<T>(path: string, id: number) {
  const res = await authFetch(`${API_BASE}${path}${id}/`, { headers: authHeaders() });
  return handleResponse<T>(res);
}

async function crudCreate<T>(path: string, data: Partial<T>) {
  const res = await authFetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<T>(res);
}

async function crudUpdate<T>(path: string, id: number, data: Partial<T>) {
  const res = await authFetch(`${API_BASE}${path}${id}/`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<T>(res);
}

async function crudPatch<T>(path: string, id: number, data: Partial<T>) {
  const res = await authFetch(`${API_BASE}${path}${id}/`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<T>(res);
}

async function crudDelete(path: string, id: number) {
  const res = await authFetch(`${API_BASE}${path}${id}/`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse<void>(res);
}

async function crudAction<T>(path: string, id: number, action: string) {
  const res = await authFetch(`${API_BASE}${path}${id}/${action}/`, {
    method: "POST",
    headers: authHeaders(),
  });
  return handleResponse<T>(res);
}

export interface TestConnectionResult {
  success?: boolean;
  status?: string;
  message?: string;
  detail?: string;
}

/* -------- 6.1 Languages -------- */
const LANG_PATH = "/api/languages/";
export const fetchLanguages = () => crudList<SupportedLanguage>(LANG_PATH);
export const getLanguage = (id: number) => crudRetrieve<SupportedLanguage>(LANG_PATH, id);
export const createLanguage = (d: Partial<SupportedLanguage>) => crudCreate<SupportedLanguage>(LANG_PATH, d);
export const updateLanguage = (id: number, d: Partial<SupportedLanguage>) => crudUpdate<SupportedLanguage>(LANG_PATH, id, d);
export const patchLanguage = (id: number, d: Partial<SupportedLanguage>) => crudPatch<SupportedLanguage>(LANG_PATH, id, d);
export const deleteLanguage = (id: number) => crudDelete(LANG_PATH, id);
export const toggleLanguageStatus = (id: number) => crudAction<SupportedLanguage>(LANG_PATH, id, "toggle-status");

/* -------- 6.2 Channels -------- */
const CHAN_PATH = "/api/channels/";
export const fetchChannels = () => crudList<SupportedChannel>(CHAN_PATH);
export const getChannel = (id: number) => crudRetrieve<SupportedChannel>(CHAN_PATH, id);
export const createChannel = (d: Partial<SupportedChannel>) => crudCreate<SupportedChannel>(CHAN_PATH, d);
export const updateChannel = (id: number, d: Partial<SupportedChannel>) => crudUpdate<SupportedChannel>(CHAN_PATH, id, d);
export const patchChannel = (id: number, d: Partial<SupportedChannel>) => crudPatch<SupportedChannel>(CHAN_PATH, id, d);
export const deleteChannel = (id: number) => crudDelete(CHAN_PATH, id);
export const toggleChannelStatus = (id: number) => crudAction<SupportedChannel>(CHAN_PATH, id, "toggle-status");

/* -------- 6.3 Data Sources -------- */
const DS_PATH = "/api/data-sources/";
export const fetchDataSources = () => crudList<DataSource>(DS_PATH);
export const getDataSource = (id: number) => crudRetrieve<DataSource>(DS_PATH, id);
export const createDataSource = (d: Partial<DataSource>) => crudCreate<DataSource>(DS_PATH, d);
export const updateDataSource = (id: number, d: Partial<DataSource>) => crudUpdate<DataSource>(DS_PATH, id, d);
export const patchDataSource = (id: number, d: Partial<DataSource>) => crudPatch<DataSource>(DS_PATH, id, d);
export const deleteDataSource = (id: number) => crudDelete(DS_PATH, id);
export const testDataSourceConnection = (id: number) => crudAction<TestConnectionResult>(DS_PATH, id, "test-connection");

/* -------- 6.4 Sender IDs -------- */
const SENDER_PATH = "/api/sender-ids/";
export const fetchSenderIds = () => crudList<SenderIdConfig>(SENDER_PATH);
export const getSenderId = (id: number) => crudRetrieve<SenderIdConfig>(SENDER_PATH, id);
export const createSenderId = (d: Partial<SenderIdConfig>) => crudCreate<SenderIdConfig>(SENDER_PATH, d);
export const updateSenderId = (id: number, d: Partial<SenderIdConfig>) => crudUpdate<SenderIdConfig>(SENDER_PATH, id, d);
export const patchSenderId = (id: number, d: Partial<SenderIdConfig>) => crudPatch<SenderIdConfig>(SENDER_PATH, id, d);
export const deleteSenderId = (id: number) => crudDelete(SENDER_PATH, id);
export const testSenderIdConnection = (id: number) => crudAction<TestConnectionResult>(SENDER_PATH, id, "test-connection");

/* -------- 6.5 Email Services -------- */
const EMAIL_PATH = "/api/email-services/";
export const fetchEmailServices = () => crudList<EmailService>(EMAIL_PATH);
export const getEmailService = (id: number) => crudRetrieve<EmailService>(EMAIL_PATH, id);
export const createEmailService = (d: Partial<EmailService>) => crudCreate<EmailService>(EMAIL_PATH, d);
export const updateEmailService = (id: number, d: Partial<EmailService>) => crudUpdate<EmailService>(EMAIL_PATH, id, d);
export const patchEmailService = (id: number, d: Partial<EmailService>) => crudPatch<EmailService>(EMAIL_PATH, id, d);
export const deleteEmailService = (id: number) => crudDelete(EMAIL_PATH, id);
export const testEmailServiceConnection = (id: number) => crudAction<TestConnectionResult>(EMAIL_PATH, id, "test-connection");

/* -------- 6.6 Customer Profile Configs -------- */
const CPC_PATH = "/api/customer-profile-configs/";
export const fetchCustomerProfileConfigs = () => crudList<CustomerProfileConfig>(CPC_PATH);
export const getCustomerProfileConfig = (id: number) => crudRetrieve<CustomerProfileConfig>(CPC_PATH, id);
export const createCustomerProfileConfig = (d: Partial<CustomerProfileConfig>) => crudCreate<CustomerProfileConfig>(CPC_PATH, d);
export const updateCustomerProfileConfig = (id: number, d: Partial<CustomerProfileConfig>) => crudUpdate<CustomerProfileConfig>(CPC_PATH, id, d);
export const patchCustomerProfileConfig = (id: number, d: Partial<CustomerProfileConfig>) => crudPatch<CustomerProfileConfig>(CPC_PATH, id, d);
export const deleteCustomerProfileConfig = (id: number) => crudDelete(CPC_PATH, id);
