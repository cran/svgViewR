svgviewr.lines <- function(x, file=NULL, y=NULL, col=NULL, z.index=0, layer="", label="", lwd=1, opacity=1, animate=TRUE, append=TRUE){

	# IF X OR Y ARE VECTOR, MAKE SINGLE COLUMN MATRIX
	if(is.vector(x)) x <- matrix(x, ncol=1)
	if(!is.null(y) && is.vector(y)) y <- matrix(y, ncol=1)

	# IF Y IS NON-NULL, ADD AS SECOND COLUMN TO X
	if(!is.null(y)) x <- cbind(x, y)

	# SUPRESS EXPONENTIAL FORMAT FOR NEARLY ZERO VALUES (CANNOT BE READ BY SVG READER)
	options(scipen=10)
	x <- round(x, 8)

	# SET GRAPHICAL PARAMETERS
	svg_gp <- c("col", "label", "layer", "opacity", "lwd", "z.index")

	# CONVERT GRAPHICAL PARAMETERS TO VECTORS WITH SAME NUMBER OF ELEMENTS OF FIRST X DIMENSION
	for(gpar in svg_gp) if(length(get(gpar)) == 1) assign(gpar, rep(get(gpar), dim(x)[1]))

	# EMPTY NEW LINES
	new_lines <- rep(NA, 0)

	# IF POINTS ARE MATRIX, MAKE INTO AN ARRAY
	if(length(dim(x)) == 2) x <- array(x, dim=c(dim(x), 1))

	# IF SECOND DIMENSION IS OF LENGTH TWO, ADD THIRD DIMENSION OF ZEROS
	if(dim(x)[2] == 2){
		xn <- array(NA, dim=c(dim(x)[1], 3, dim(x)[3]))
		for(i in 1:dim(x)[3]){
			if(is.matrix(x[, , i])){
				xn[, , i] <- cbind(x[, , i], rep(0, nrow(x[, , i])))
			}else{
				xn[, , i] <- c(x[, , i], 0)
			}
		}
		x <- xn
	}

	# WRITE LINES TO SVG STRUCTURE
	for(i in 1:(dim(x)[1]-1)){

		animate_lines_str <- ""
		if(dim(x)[3] > 1 && animate == TRUE){

			# CHECK THAT POINTS CHANGE POSITION BEFORE PRINTING ANIMATION STRING
			sum_sd0 <- sum(apply(matrix(x[i, , ], ncol=3, byrow=T), 2, sd))
			sum_sd1 <- sum(apply(matrix(x[i+1, , ], ncol=3, byrow=T), 2, sd))

			if(is.na(sum_sd0) || is.na(sum_sd1) || sum_sd0 > 0 || sum_sd1 > 0){

				line_rows <- matrix(t(apply(x[i:(i+1), , ], 2, cbind)), ncol=6, byrow=TRUE)

				animate_lines_str <- paste("animate=\"", paste(apply(line_rows, 1, 'paste', collapse=" "), collapse=", "), "\"", sep="")
			}
		}

		new_lines <- c(new_lines, paste("\t<line z-index=\"", z.index[i], "\" layer=\"", layer[i], "\" x1=\"", x[i, 1, 1], "\" y1=\"", x[i, 2, 1], "\" z1=\"", x[i, 3, 1], "\" x2=\"", x[i+1, 1, 1], "\" y2=\"", x[i+1, 2, 1], "\" z2=\"", x[i+1, 3, 1], "\" label=\"", label[i], "\" stroke=\"", col[i], "\" stroke-width=\"", lwd[i], "\" opacity=\"", opacity[i], "\" ", animate_lines_str," />", sep=""))

		if(dim(x)[3] > 1 && animate == FALSE){
			for(k in 2:dim(x)[3]){
				new_lines <- c(new_lines, paste("\t<line z-index=\"", z.index[i], "\" layer=\"", layer[i], "\" x1=\"", x[i, 1, k], "\" y1=\"", x[i, 2, k], "\" z1=\"", x[i, 3, k], "\" x2=\"", x[i+1, 1, k], "\" y2=\"", x[i+1, 2, k], "\" z2=\"", x[i+1, 3, k], "\" label=\"", label[i], "\" stroke=\"", col[i], "\" stroke-width=\"", lwd[i], "\" opacity=\"", opacity[i], "\" ", animate_lines_str," />", sep=""))
			}
		}
	}

	# IF FILE IS NULL, RETURN LINES OF SVG OBJECTS
	if(is.null(file)) return(new_lines)

	# SAVE NEW LINES TO FILE
	svgviewr.write(new_lines, file, append=append)
}