TESTS = test/*.js
MOCHA_REPORTER = spec

test: 
	./node_modules/.bin/mocha

cov test-cov:
	./node_modules/.bin/istanbul cover node_modules/.bin/_mocha --report lcovonly 


.PHONY: test cov test-cov