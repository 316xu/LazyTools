#!/bin/sh

RUNDIR=`pwd`;
BASEDIR=${RUNDIR}"/"$(dirname "$0")
echo $RUNDIR
echo $BASEDIR 

generator(){
  echo $1;
  PROJECTDIR=${RUNDIR}"/"${1}
  eval "cp -r "${BASEDIR}"/main "${PROJECTDIR}
  eval "find "${PROJECTDIR}" -type f -exec sed -i 's/appname/"${1}"/g' {} +"
  CODEDIR=$(echo $1 | tr '[:upper:]' '[:lower:]')
  echo $CODEDIR;
  eval "mv "${PROJECTDIR}"/app/src/main/java/cn/xujifa/app_name "${PROJECTDIR}"/app/src/main/java/cn/xujifa/"$CODEDIR
  echo "mv "${PROJECTDIR}"/app/src/main/java/cn/xujifa/app_name "${PROJECTDIR}"/app/src/main/java/cn/xujifa/"$CODEDIR
  return 0; 
}


temp=`getopt -o g:l: --long generator:,lib: \
  -n 'example.bash' -- "$@"`
if [ $? != 0 ] ; then echo "terminating..." >&2 ; exit 1 ; fi
# note the quotes around `$temp': they are essential!
#set 会重新排列参数的顺序，也就是改变$1,$2...$n的值，这些值在getopt中重新排列过了
eval set -- "$temp"
#经过getopt的处理，下面处理具体选项。
while true ; do
  case "$1" in
    -g|--generator) 
      echo "option g $2"
      generator $2;
      shift 2;;
    -l|--lib) echo "option l $2"; shift 2;;
    *) exit 1;;
  esac
done


