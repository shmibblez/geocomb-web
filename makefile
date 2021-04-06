CC=em++
flags=-std=c++17 -stdlib=libc++ -Wall -Wextra -Wreorder-ctor
include_dirs=/Users/shmibbles/emsdk/upstream/emscripten/system/include
exported_functions=_embind_register_class_constructor

all: icosahedron.o triangle.o phex.o point3.o
	$(CC) --bind $(flags) icosahedron.o triangle.o phex.o point3.o -o lib/geocomb-web.js --no-entry
	make clean
# ar rcs lib/geocomb-web.a icosahedron.o triangle.o phex.o point3.o

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

# em++ -std=c++17 -stdlib=libc++ -Wall -Wextra -Wreorder-ctor -I /Users/shmibbles/emsdk/upstream/emscripten/system/include src/cpp/icosahedron.cpp -o lib/output.js --bind -s WASM=0

# em++ -std=c++17 -stdlib=libc++ -Wall -Wextra -Wreorder-ctor -I /Users/shmibbles/emsdk/upstream/emscripten/system/include src/cpp/icosahedron.cpp -o lib/output.js -s WASM=0 -s LINKABLE=1 -s EXPORT_ALL=1

# -s EXPORTED_FUNCTIONS=_embind_register_class,_embind_register_class_constructor,_embind_register_class_function