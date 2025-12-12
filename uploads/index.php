<?php
// Previne accesul direct și listarea directorului
header('HTTP/1.0 403 Forbidden');
exit('Acces interzis.');
