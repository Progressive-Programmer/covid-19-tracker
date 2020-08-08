import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'

function Infobox({ title, cases, total}) {
    return (
        <Card>
            <CardContent>
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>
                
                {/* +120k Number of cases */}
                <h2>{cases}</h2>

                {/* Total number of cases */}
                <Typography className="infoBox__total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default Infobox
