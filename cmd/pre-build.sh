
if [ -d "build/" ]; then
  echo "build/ does exist. Remove folder"
  rm -rf ./build
fi

if [ -d "build.zip" ]; then
    echo "build.zip does exist. Remove zip"
    rm build.zip
fi

npm run-script



mv -v -i -f ./build/static/js/main.*.chunk.js ./build/static/js/main-app.chunk.js
mv -v -i -f ./build/static/js/main.*.js ./build/static/js/main-app.js
mv -v -i -f ./build/static/js/main.*.js.map ./build/static/js/main-app.js.map


mv -v -i -f ./build/static/css/main.*.css ./build/static/css/main-app.css
mv -v -i -f ./build/static/css/main.*.css.map ./build/static/css/main-app.css.map




