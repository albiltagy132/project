const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

let test = it;
let url = "http://localhost:3000/api";

describe.only("GET", () => {
	test("Return The Ids From 2 Random Reviewers", (done) => {
		chai.request(url)
			.get("/papers?rondomReviewers=2")
			.end((err, res) => {
				chai.expect(res).to.have.status(200);
				done();
			});
	});
	test("Return All Users", (done) => {
		chai.request(url)
			.get("/seeds?type=users")
			.end((err, res) => {
				chai.expect(res).to.have.status(200);
				chai.expect(res.body).to.be.an("object");
				done();
			});
	});
	test("Return All Locations", (done) => {
		chai.request(url)
			.get("/seeds?type=locations")
			.end((err, res) => {
				chai.expect(res).to.have.status(200);
				chai.expect(res.body).to.be.an("object");
				done();
			});
	});
});
