const expect = require('chai').expect
var app =require("./app")
var request = require('supertest')

it('Creating a new task works',(done=>{
    request(app).post('/tasks')
    .send({id:'ex1',title:'ex title',description:'ex description',project_id:'ex3',due_date:'ex 2020_3_3',status:'ex new'})
    .then((res)=>{
        const body = res.body
        expect(body).to.contain.property('id'),
        expect(body).to.contain.property('title'),
        expect(body).to.contain.property('description'),
        expect(body).to.contain.property('project_id'),
        expect(body).to.contain.property('due_date'),
        expect(body).to.contain.property('status')
        done()
    })
    .catch((err)=>done(err))
}))