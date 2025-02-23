import { RegtestUtils } from 'regtest-client';

const APIPASS = process.env.APIPASS || 'yatosketch';
const APIURL = process.env.APIURL || 'http://127.0.0.1:18981';

export const regtestUtils = new RegtestUtils({ APIPASS, APIURL });
