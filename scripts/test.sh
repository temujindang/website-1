#!/bin/bash
set -e
set -o pipefail

echo "Checking that the matrix endpoints are content-type: application/json"
resp=$(curl -Ls -o /dev/null -w "%{content_type}" https://oxide.computer/.well-known/matrix/server)
if [[ "${resp}" != "application/json" ]]; then
	echo ".well-known/matrix/{anything} should be content-type: application json"
	echo "got: ${resp}"
	exit 1
fi
echo "Test passed!"

echo "Checking that redirects work."
resp=$(curl -Ls -o /dev/null -w "%{http_code}" https://oxide.computer/blog/on-the-metal-9-jonathan-blow/)
if [[ "${resp}" != "200" ]]; then
	echo "A redirected URL should have returned a status code of 200"
	echo "got: ${resp}"
	exit 1
fi
echo "Test passed!"

echo "Checking that 404 page renders"
resp=$(curl -sSL https://oxide.computer/thing)
if ! echo "$resp" | grep -q "UA-148178470-1"; then
	echo "Expected our 404 page to be returned"
	exit 1
fi
echo "Test passed!"
