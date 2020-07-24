<?php
namespace App\Lib\FileUpload;

class File{

    protected $file= null;
    protected $pathInfo = null;
    
    function __construct($file){
        $this->file = $file;
    }
    /**
     * Retorna nome original do arquivo
     *
     * @return string
     */
    public function getName(){
        return $this->file->getClientFilename();
    }
    /**
     * Retorna nome temporário do arquivo uploud
     *
     * @return string
     */
    public function getNameTmp(){
        return  $this->file->file;
    }

    /**
     * Retornar MediaType do arquivo. Ex: 'image/bmp','image/jpg'
     *
     * @return string
     */
    public function getType(){
        return $this->file->getClientMediaType();
    }
    /**
     * Retorna extensão original do arquivo.
     *
     * @return string
     */
    public function getExtesionOrin(){
        $extension = pathinfo($this->file->getClientFilename(), PATHINFO_EXTENSION);
        return $extension;
    }
    /**
     * Retorna tamanho do arquivo 
     *
     * @return int
     */
    public function getSize(){
        return $this->file->getSize();
    }
    /**
     * Retorna tamanho do arquivo mb
     *
     * @return int
     */
    public function getSizeMb(){
        return round($this->file->getSize() / 1024 / 1024, 1); 
    }
    /**
     * Checa se arquivo é uma arquivo valido.
     *
     * @return boolean
     */
    public function isDoc(){
        $types = [
            'pdf',
            'doc',
            'docx',
            'ods',
            'odt',
            'txt',
            'xlsx',
            'xls',
            'csv',
            'pps',
            'ppsx',
            'ppt'
        ];
        return in_array($this->getExtesionOrin(),$types);
    }
    /**
     * Checa se arquivo é do tipo imagem.
     *
     * MediaType = 'image/pjpeg','image/bmp','image/jpg','image/jpeg','image/gif','image/png'
     * @return boolean
     */
    public function isImage(){
        $types = ['pjpeg','bmp','jpg','jpeg','gif','png'];
        return in_array(strtolower($this->getExtesionOrin()),$types);
    }
    /**
     * Move arquivo para caminho passado por paramentro. 
     * Preciso passa nome arquivo junto.
     *
     * @param string $caminho
     * @return string
     */
    function move($caminho,$randoName=false){
        list( $dirname,$filename ) = array_values(pathinfo($caminho));

        $this->createdDir($dirname);
        if($randoName){
            $basename = bin2hex(random_bytes(12)); // see http://php.net/manual/en/function.random-bytes.php
            $filename = sprintf('%s.%0.8s', $basename, $this->getExtesionOrin());

            $caminho .= '/'.$filename;
        }
        $this->file->moveTo($caminho);

        return $filename;
    }

    private function createdDir($path){
        if(!is_dir($path)){
            mkdir($path,0777,true);
        }
    }
}
?>