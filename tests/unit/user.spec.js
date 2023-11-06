const mongoose = require('mongoose');
const chai = require('chai');
const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');
const { HTTP_STATUS_CODES } = require('../../src/utils/constants');

require('dotenv').config({ path: './config.env'});

beforeEach(async () => {
  await mongoose.connect(process.env.DATABASE)
  await mongoose.connection;
  console.log('Connected to database')
});

afterEach(async () => {
  await mongoose.connection.close();
  console.log('Connection closed')
})

describe("Slack User REST API test /api/v1/users/:id", () => {
  it('GET user- user not found in database', async () => {
    const response = await request(app).get('/api/v1/users/5c8a34ed14eb5c17645c9108');
    expect(response.statusCode).toBe(HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.NOT_FOUND);
    console.log(response.body)
  })
})