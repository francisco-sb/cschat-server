dev:
	@webpack example/index.js example/bundle.js -w -d

test:
	@node_modules/.bin/karma start --single-run

doc:
	@webpack example/index.js example/bundle.js
	@mkdir .gh-pages
	@cp example/* .gh-pages
	@cp tabs.css .gh-pages
	@sed -i 's/..\/tabs/tabs/' .gh-pages/index.html
	@ghp-import .gh-pages -n -p
	@rm -fr .gh-pages

clean:
	rm -rf components build

.PHONY: clean test test-browser dev
