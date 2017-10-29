function factorial( n )
    if n == 0 then
        return 1
    else
        return n * factorial( n - 1 )
    end
end

n = 10
fact = factorial( n )
print( 'The Factorial of ' .. n .. ' = ' .. fact )

