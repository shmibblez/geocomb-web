CC=em++
flags=-std=c++17 -stdlib=libc++ -Wall -Wextra -Wreorder-ctor
include_dirs=/Users/shmibbles/emsdk/upstream/emscripten/system/include
exported_functions=_embind_register_class_constructor
debug_flags=-s NO_DISABLE_EXCEPTION_CATCHING -g -s ASSERTIONS=1

all: icosahedron.o triangle.o phex.o point3.o
	$(CC) --bind $(flags) icosahedron.o triangle.o phex.o point3.o -o src/geocomb-web.js --no-entry -s WASM=0
	make clean

debug: icosahedron.o triangle.o phex.o point3.o
	$(CC) --bind $(flags) icosahedron.o triangle.o phex.o point3.o -o src/geocomb-web.js --no-entry -s WASM=0 $(debug_flags)
	make clean

icosahedron.o: src/cpp/enums.hpp src/cpp/point3.hpp src/cpp/triangle.hpp
	$(CC) $(flags) -c src/cpp/icosahedron.cpp

triangle.o: src/cpp/enums.hpp src/cpp/point3.hpp
	$(CC) $(flags) -c src/cpp/triangle.cpp

phex.o: src/cpp/icosahedron.hpp src/cpp/point3.hpp
	$(CC) $(flags) -c src/cpp/phex.cpp

point3.o: src/cpp/constants.hpp src/cpp/enums.hpp
	$(CC) $(flags) -c src/cpp/point3.cpp

clean:
	rm -f *.o