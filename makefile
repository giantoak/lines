rlines: rlines/R/*.R rlines/DESCRIPTION
	/usr/lib/R/bin/R --vanilla CMD build '/home/jeffrey/lines/rlines' --no-manual --no-resave-data 
	sudo R CMD INSTALL rlines_1.0.tar.gz --library=/usr/lib/opencpu/library/
	sudo service apache2 restart

force: .FORCE

.FORCE:
	/usr/lib/R/bin/R --vanilla CMD build '/home/jeffrey/lines/rlines' --no-manual --no-resave-data 
	sudo R CMD INSTALL rlines_1.0.tar.gz --library=/usr/lib/opencpu/library/
	sudo service apache2 restart

