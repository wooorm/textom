
test:
	@./node_modules/.bin/mocha --reporter min --watch spec/**/*

lint:
	@./node_modules/.bin/jshint index.js lib/util.js spec/*.spec.js

cover:
	@./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- -- -u exports -R spec spec/**/*

.PHONY: lint cover
