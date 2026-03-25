#include<iostream>
using namespace std;

int root(int n){
    int s = 0, e = n;
    int ans = -1;

    while(s <= e){
        int mid = s + (e - s)/2;

        if(1LL * mid * mid == n){
            return mid;
        }
        else if(1LL * mid * mid < n){
            ans = mid;
            s = mid + 1;  
        }
        else{
            e = mid - 1;
        }
    }
    return ans;
}
//we can use long long int as well
int main(){
    int num = 11;
    cout << root(num);
    return 0;
}