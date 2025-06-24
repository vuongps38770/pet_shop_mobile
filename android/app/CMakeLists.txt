cmake_minimum_required(VERSION 3.13)

set(CMAKE_VERBOSE_MAKEFILE ON)
set(CMAKE_CXX_STANDARD 17)

add_library(appmodules SHARED
    ${CMAKE_SOURCE_DIR}/src/main/cpp/empty.cpp)

find_library(LOG_LIB log)

target_link_libraries(appmodules
    ${LOG_LIB}) 