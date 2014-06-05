make: lint cover

test:
	@./node_modules/.bin/mocha --reporter spec --check-leaks -u exports spec/*.spec*.js

watch:
	@./node_modules/.bin/mocha --reporter min --check-leaks --watch spec/*.spec*.js

lint:
	# Lint (passes when empty):
	@./node_modules/.bin/jshint index.js spec/*.spec*.js
	@./node_modules/.bin/jscs index.js spec/*.spec*.js --reporter=inline

cover:
	@./node_modules/.bin/istanbul cover --report html ./node_modules/.bin/_mocha -- -- spec spec/textom.spec.js

.PHONY: make test watch lint cover
