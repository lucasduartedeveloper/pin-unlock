<?php
$sql ="";
try {
    if (isset($_GET["url"])) {
        $url = $_GET["url"];
        $contents = file_get_contents($url);

        $contents = str_replace("</body>",
        "<script src=\"//cdn.jsdelivr.net/npm/eruda\"></script>".
        "<script>eruda.init();</script></body>", $contents);
        echo $contents;
    }
}
catch (PDOException $e) {
   echo 'Connection failed: ' . $e->getMessage();
   echo $sql;
}
catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
    echo $sql;
}
?>