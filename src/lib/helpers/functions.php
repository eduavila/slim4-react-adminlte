<?php



/**
 * Dump the items and end the script.
 *
 * @param  mixed  ...$args
 * @return void
 */
if(!function_exists('dd')){
    function dd(...$args)
    {
        echo "<pre>";
        var_dump($args);
        echo "</pre>";
        die(1);
    }
}

if(!function_exists('diffClass')){
/**
 * Diff da class 
 *
 * @param [type] $data
 * @param [type] $dataDiff
 * @return void
 */
    function diffClass(array $data,array $dataDiff){
        $change = [];
        foreach($dataDiff as $key => $value){
       
            if(!array_key_exists($key,$data)){
                continue;
            }

            if($data[$key] != $value)
            {
                array_push($change,['attr'=>$key,'de'=>$data[$key],'para'=>  $value ]);
            }
        }

        return $change;
    }
}

if(!function_exists('getExtension')){
    function getExtension($file) {
        $extension = explode(".", $file);
        $end = end($extension);

        return $end ? $end : false;
    }
}



if(!function_exists('replaceTags')){
    function replaceTags($text,$dataReplace){
        foreach ($dataReplace as $key => $value) {
            $text = str_replace('{'.$key.'}',$value,$text);
        }
        
        return $text;
    }
}

/**
 * Debuga Query aloquent , juntando os bidings .
 *
 * @param [type] $query
 * @return void
 */

if(!function_exists('ddQuery')){
    function ddQuery($query){
        $result = str_replace(array('?'), array('\'%s\''),$query->toSql());
        $result = vsprintf( $result,$query->getBindings());
        echo $result;
        exit;
    }
}
