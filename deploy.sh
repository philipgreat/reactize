#!/system/bin/sh


function dochange(){

	echo "file change" 
	cp  ggas/* /opt/resin/webapps/ROOT/ggas/ 

}

function monitor(){

	fswatch -o ggas | xargs -n1 -I{}  cp  ggas/* /opt/resin/webapps/ROOT/ggas/&&echo "sync"

}

function showfile(){

   fswatch -o ggas  --batch-marker=EOF -xn . | while read file event; do 
   echo $file $event
   if [ $file = "EOF" ]; then 
      echo TRIGGER
   fi
	done


}

function showchange(){

	echo "find change， will execute cp  ggas/* /opt/resin/webapps/ROOT/ggas/ "
	cp  ggas/* /opt/resin/webapps/ROOT/ggas/

}

#fswatch -o ggas | xargs -n1 -I{}  bash deploy.sh 

showchange


# will not run here

