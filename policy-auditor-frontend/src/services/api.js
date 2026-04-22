import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api/policies";

export const getPolicies = () => axios.get(API_BASE_URL);
export const getAuditHistory = (id) => axios.get(`${API_BASE_URL}/${id}/history`);
export const updatePolicy = (id, data) => axios.put(`${API_BASE_URL}/${id}`, data);