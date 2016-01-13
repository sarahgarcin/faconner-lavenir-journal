<?php
	$directory = "content/journal1/";
	$dirs = array_filter(glob($directory."*"), 'is_dir');
	$file_display = array('jpg', 'jpeg', 'png', 'gif');

	foreach($dirs as $dir){ ?>
		<div class="article">
			<!-- TEXT FILES -->
			<?php foreach (glob($dir."/*.txt") as $filename) {
			  $time = filemtime($filename);
			  $files[$filename] = $time;
			  $content = file_get_contents($filename);
			  //echo file content markdown to html
			  echo $Parsedown->text($content);
			  ?>

			<?php }
			// IMAGES FILES
		  $dir_contents = scandir($dir);
  		foreach ($dir_contents as $file) {
    		$file_type = strtolower(end(explode('.', $file)));
				if ($file !== '.' && $file !== '..' && in_array($file_type, $file_display) == true){
          $images[$file] = $dir. '/'. $file;
          echo '<img src="'. $dir. '/'. $file. '" alt="'. $file. '" />';
   			}
  		}?>
  	</div>
	<?php }
	arsort($files);

?>