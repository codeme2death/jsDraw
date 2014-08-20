<html>
  <head>
    <title></title>
    <meta content="">
    <style>
        body {
            background-color:#000000;
            color:#ffffff;
        }
        canvas {
            cursor:pointer;
            position:relative;
            padding:0px ;
            margin:10px 0px 0px 0px;
            border:5px groove #888;

        }
        canvas:active, canvas:focus {
                cursor: crosshair;
        }
        #control {
                list-style-type: none;
                padding:5px;
                margin:5px 0px;
                height:50px;
                width:100%;
        }
        #control li:first-child {
                padding-right:10px;
        }
        #control li {
                float:left;
                display:inline;
                padding:5px 10px;
                border-right: 1px solid #888;
        }
        #control img {
                position:relative;
                margin-left:5px;
        }
        .color {
                background: none;
                width:70px;
                border:1px solid #888;
        }
        #info {
                height:10px;
                width:100px;
        }
        #brush {
                width:100px;
                height:20px;
        }
        #jsBrush {
                background-color:#000;
                color:#000;
        }    
    </style>
    <script src="./jscolor/jscolor.js"></script>
    <script src="./jsDraw.js"></script>
    <script type="text/javascript" >
        function newCanvas(elementName) {
            var element;
            if(document.getElementById(elementName)) {
                element = document.getElementById(elementName);
                if(element.jsDraw) {
                    element.jsDraw.newCanvas();
                }
            }
        }
        function setBrushColor(color,elementName) {
            var element;
            if(document.getElementById(elementName)) {
                element = document.getElementById(elementName);            
                if(element.jsDraw) {
                   element.jsDraw.setBrushColor(color);             
                }
            }
        }
        function setBackgroundColor(color,elementName) {
            var element;
            if(document.getElementById(elementName)) {
                element = document.getElementById(elementName);            
                if(element.jsDraw) {
                   element.jsDraw.setBackgroundColor(color);             
                }
            }
        }
        function saveCanvas(elementName) {
            var element;
            if(document.getElementById(elementName)) {
                element = document.getElementById(elementName);            
                if(element.jsDraw) {
                   element.jsDraw.saveCanvas();             
                }
            }
        }
        function undo(elementName) {
            var element;
            if(document.getElementById(elementName)) {
                element = document.getElementById(elementName);            
                if(element.jsDraw) {
                  element.jsDraw.undo();             
                }  
            }
        }
        function redo(elementName) {
            var element;
            if(document.getElementById(elementName)) {
                element = document.getElementById(elementName);            
                if(element.jsDraw) {
                   element.jsDraw.redo();             
                }  
            }
        }
        function eraserBrush(elementName) {
            var element;
            if(document.getElementById(elementName)) {
                element = document.getElementById(elementName);            
                if(element.jsDraw) {
                   element.jsDraw.setEraserColor();             
                }      
            }
        }
        function updateBrushWidth(value,elementName) {
            var element;
            if(document.getElementById(elementName)) {
                element = document.getElementById(elementName);
                if(element.jsDraw) {
                   element.jsDraw.updateBrushWidth(value);
                }
            }
        }
        function brushCanvas(elementName) {
            var element;
            if(document.getElementById(elementName)) {
                element = document.getElementById(elementName);            
                if(element.jsDraw) {
                   element.jsDraw.brushCanvas();
                } 
            }
        }
        function postForm(elementId) {
            var d = document.getElementById(elementId);
            d.submit();
        }
    </script>    
  </head>
  <body>
<?   
$amount = 1;
if($_POST) {
	$amount = $_POST["drawAmount"];   
}
?>  
    <?php 
        for ($i=0;$i < $amount; $i++) { 
        $id = "'canvas".$i."'";
        ?>
        <ul id="control">
            <li>
                            <img src="./images/newFile.png" onClick="newCanvas(<?php echo $id ?>);" alt="New File" title="New File" width="30" height="40"/>
            </li>
            <li>
                            <img src="./images/save.png" onClick="saveCanvas(<?php echo $id ?>);" alt="Save" title="Save"  width="40" height="40"/>
            </li>
            <li>
                            <img src="./images/brush.png" onClick="brushCanvas(<?php echo $id ?>);" alt="Draw" title="Draw"  width="40" height="40"/>
            </li>
            <li>
                            <img src="./images/eraser.png" onClick="eraserBrush(<?php echo $id ?>);" alt="Erase" title="Erase"  width="40" height="40"/>
            </li>
            <li>
                            <img src="./images/undo.png" onClick="undo(<?php echo $id ?>);" alt="Undo" title="Undo"  width="40" height="40"/>
            </li>
            <li>
                            <img src="./images/redo.png" onClick="redo(<?php echo $id ?>);" alt="Redo" title="Redo"  width="40" height="40"/>
            </li>
            <li>
                            Brush Size: <br />1
                                    <input type="range" name="brushSize" min="1" max="10" step="1"
                                        value="3" onChange="updateBrushWidth(this.value,<?php echo $id ?>);" id="brush"/>
                            10
            </li>
            <li>
                            Brush Color:<br /> 
                            <input onchange="setBrushColor(this,<?php echo $id ?>);" 
                                class="color {slider:true,pickerFace:1,pickerPosition:'bottom'} jsBrush" id="color"  value="#000000" readonly/>
            </li>
            <li>
                            Background Color:<br /> 
                            <input onchange="setBackgroundColor(this,<?php echo $id ?>);"
                                class="color {slider:false,pickerFace:1,pickerPosition:'bottom'}" id="bkcolor" readonly/>
            </li>
            <?php if($i == 0) { ?>
            <li>
                <form action="multipleExample.php" method="post" id="drawAmount">
                            Canvas Amount<br />
                            <select name="drawAmount" style="width:100px" onChange="postForm('drawAmount')">
                            <?php 
                                    $limit = 20;
                                    for($count =1;$count <= $limit; $count++) {
                                            $selected = ($amount == $count) ? "selected" : "";
                                            echo '<option value="'.$count.'" '.$selected.' >'.$count.'</option>';
                                    }
                            ?>
                            </select>
                            </form>
            </li>
            <?php } ?>            
        </ul> 
        <canvas class="canvas jsDraw" id="canvas<?php echo $i ?>" width="970px" height="400px" >
                Your browser does not support HTML5. Please upgrade your browser.
        </canvas>  
        <?php } ?>  
  </body>
</html>