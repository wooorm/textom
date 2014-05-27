make: lint cover

test:
	@./node_modules/.bin/mocha --reporter spec spec/*.spec*.js

watch:
	@./node_modules/.bin/mocha --reporter min --watch spec/*.spec*.js

lint:
	# Lint (passes when empty):
	@./node_modules/.bin/jshint index.js spec/*.spec*.js
	@./node_modules/.bin/jscs ./index.js --reporter=inline

cover:
	@./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- -- spec spec/textom.spec.js

.PHONY: make test watch lint cover
