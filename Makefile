make: lint cover

test:
	@./node_modules/.bin/mocha --reporter spec spec/*.spec.js

watch:
	@./node_modules/.bin/mocha --reporter min --watch spec/**/*

lint:
	@./node_modules/.bin/jshint index.js spec/*.spec.js

cover:
	@./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- -- -u exports -R spec spec/**/*

.PHONY: make test watch lint cover
