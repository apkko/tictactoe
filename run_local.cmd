explorer "http://localhost:8889"
cd /d %~dp0
http-server ./build-local -p 8889 -a 127.0.0.1